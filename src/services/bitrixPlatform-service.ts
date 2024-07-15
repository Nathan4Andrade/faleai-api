import { BitrixPlatform } from "@prisma/client";
import { bitrixPlatformRepository, userRepository } from "@/repositories";
import { bitrixError, notFoundError, permissionError } from "@/errors";
import axios, { AxiosError, AxiosResponse } from "axios";

import fs from "fs";
import * as path from "path";

const clientId = process.env.BITRIX_CLIENT_ID;
const clientSecret = process.env.BITRIX_CLIENT_SECRET;
const settings = path.join(__dirname, "../../../settings");

export type Config = {
  access_token: string;
  expires_in: string;
  application_token: string;
  refresh_token: string;
  domain: string;
  client_endpoint: string;
};

export async function getOrUpdateBitrixTokens(
  managerId: number,
  bitrixPlatformId: number
) {
  let newAccessToken: string;
  let newRefreshToken: string;
  const { accessToken, refreshToken, url, updatedAt } =
    await bitrixPlatformServices.getMyBitrixData(managerId);

  const needsTokenRefresh = isTokenExpired(updatedAt);
  // verificar se o schedule tem intervalo de almoço
  if (needsTokenRefresh) {
    const tokens = await obtainAccessTokens(
      clientId,
      clientSecret,
      refreshToken
    );

    newAccessToken = tokens.access_token;
    newRefreshToken = tokens.refresh_token;

    await bitrixPlatformRepository.updateBitrixPlatform(bitrixPlatformId, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } else {
    newAccessToken = accessToken;
    newRefreshToken = refreshToken;
  }
  return { newAccessToken, newRefreshToken, url };
}

export function isTokenExpired(updatedAt: Date) {
  const MINUTES_THRESHOLD = 40;
  const updatedAtDate = new Date(updatedAt);
  const thresholdDate = new Date(Date.now() - MINUTES_THRESHOLD * 60 * 1000);
  return updatedAtDate < thresholdDate;
}

function loadPlataformSettings(url: string): Config {
  const files = fs.readdirSync(settings);
  // Itera sobre cada arquivo encontrado
  for (const file of files) {
    if (file.endsWith(".json")) {
      const pathFile = path.join(settings, file);
      // Lê o conteúdo do arquivo
      const dataFile = fs.readFileSync(pathFile, "utf-8");
      // Faz o parse do conteúdo para o tipo definido pela interface ConfigData
      const configData: Config = JSON.parse(dataFile);
      if (configData.client_endpoint.includes(url)) {
        return configData;
      }
    }
  }
  return null;
}

// associa o a BitrixPlataform a um Manager a partir da URL da plataforma e cria os usuários da plataforma
export async function createOrUpdateBitrixPlatform(
  url: string,
  userId: number
): Promise<BitrixPlatform> {
  if (!validateURL(url)) throw bitrixError("URL inválida");
  const findBitrixPlatform =
    await bitrixPlatformRepository.findBitrixPlatformByUrl(url);

  const user = await userRepository.findUserById(userId);
  if (!user) throw notFoundError();

  let accessToken: string;
  let newRefreshToken: string;
  let memberId: string;

  const parsedURL = new URL(url);

  if (findBitrixPlatform === null) {
    const platformSettings = loadPlataformSettings(parsedURL.hostname);

    if (!platformSettings)
      throw bitrixError("O aplicativo não está instalado em um painel Bitrix");

    const tokens = await obtainAccessTokens(
      clientId,
      clientSecret,
      platformSettings.refresh_token
    );
    accessToken = tokens.access_token;
    newRefreshToken = tokens.refresh_token;
    memberId = tokens.member_id;

    const bitrixPlatform = await bitrixPlatformRepository.createBitrixPlatform({
      url,
      accessToken,
      refreshToken: newRefreshToken,
      memberId,
      User: { connect: { id: userId } },
    });

    return bitrixPlatform;
  } else {
    const needsTokenRefresh = isTokenExpired(findBitrixPlatform.updatedAt);
    if (needsTokenRefresh) {
      const tokens = await obtainAccessTokens(
        clientId,
        clientSecret,
        findBitrixPlatform.refreshToken
      );

      accessToken = tokens.access_token;
      newRefreshToken = tokens.refresh_token;
      memberId = tokens.member_id;

      const updatedBitrixPlatform =
        await bitrixPlatformRepository.updateBitrixPlatform(
          findBitrixPlatform.id,
          {
            accessToken,
            refreshToken: newRefreshToken,
          }
        );

      return updatedBitrixPlatform;
    } else {
      accessToken = findBitrixPlatform.accessToken;
      newRefreshToken = findBitrixPlatform.refreshToken;
      memberId = findBitrixPlatform.memberId;

      return findBitrixPlatform;
    }
  }
}

export async function findBitrixPlatformById(
  bitrixPlatformId: number,
  userId: number
): Promise<BitrixPlatform | null> {
  const bitrixPlatform = await bitrixPlatformRepository.findBitrixPlatformById(
    bitrixPlatformId
  );
  if (!bitrixPlatform) throw notFoundError();
  if (bitrixPlatform.userId !== userId) throw permissionError();
  return bitrixPlatform;
}

export async function deleteBitrixPlatform(
  bitrixPlatformId: number
): Promise<BitrixPlatform> {
  return await bitrixPlatformRepository.deleteBitrixPlatform(bitrixPlatformId);
}

export async function updateBitrixPlatform(
  bitrixPlatformId: number,
  url: string
): Promise<BitrixPlatform> {
  const isValid = validateURL(url);
  if (!isValid)
    throw bitrixError(
      "URL inválida, é necessário iniciar com https:// e terminar com .bitrix24.com.br/"
    );

  return await bitrixPlatformRepository.updateBitrixPlatform(bitrixPlatformId, {
    url,
  });
}

export async function findAllBitrixPlatforms(): Promise<BitrixPlatform[]> {
  return await bitrixPlatformRepository.findAllBitrixPlatforms();
}

export async function obtainAccessTokens(
  clientId: string,
  clientSecret: string,
  refreshToken: string
) {
  const uri = `https://oauth.bitrix.info/oauth/token/?grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}`;

  try {
    const response: AxiosResponse = await axios.get(uri);
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      member_id: response.data.member_id,
      // Incluir outras propriedades conforme necessário
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      console.error(`Erro de requisição ao obter token: ${axiosError.message}`);
    } else {
      console.error(`Erro desconhecido ao obter token: ${error}`);
    }
    throw bitrixError(
      "Erro ao obter tokens de acesso, verifique se o aplicativo está instalado"
    );
  }
}

function validateURL(url: string) {
  // Verifica se a URL está vazia ou não é uma string
  if (typeof url !== "string" || url.trim() === "") {
    return false;
  }

  // Remove espaços em branco do início e do fim da URL
  url = url.trim();

  // Verifica se a URL termina com "/", se não terminar, adiciona
  if (!url.endsWith("/")) {
    url += "/";
  }

  // Verifica se a URL começa com "https://", adiciona se não estiver presente
  if (!url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    // Cria um novo objeto URL para validar a estrutura da URL
    var parsedURL = new URL(url);

    // Verifica se o domínio é ".bitrix24." e se o domínio está entre os permitidos
    if (
      !parsedURL.hostname.includes(".bitrix24.") ||
      !isAllowedDomain(parsedURL.hostname)
    ) {
      return false;
    }
  } catch (error) {
    // Se ocorrer um erro ao analisar a URL, retorna falso
    return false;
  }

  return true;
}

// Função auxiliar para verificar se o domínio está entre os permitidos
function isAllowedDomain(domain) {
  var allowedDomains = [
    "com.br",
    "com",
    "ru",
    "es",
    "fr",
    "eu",
    "de",
    "uk",
    "cn",
    "vn",
    "jp",
    "in",
    "br",
  ];
  var domainParts = domain.split(".");
  var topLevelDomain = domainParts[domainParts.length - 1];

  return allowedDomains.includes(topLevelDomain);
}

export async function getMyBitrixData(userId: number) {
  const user = await userRepository.findUserById(userId);
  if (!user) throw notFoundError();
  const bitrixPlatform =
    await bitrixPlatformRepository.findBitrixPlatformByUserId(userId);

  if (!bitrixPlatform) throw notFoundError();

  const result = await createOrUpdateBitrixPlatform(bitrixPlatform.url, userId);

  return result;
}

export const bitrixPlatformServices = {
  createOrUpdateBitrixPlatform,
  findBitrixPlatformById,
  deleteBitrixPlatform,
  updateBitrixPlatform,
  findAllBitrixPlatforms,
  getMyBitrixData,
};
