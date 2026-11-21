import { cookies, headers } from "next/headers";
import { LANG_COOKIE, isLang, langFromAcceptLanguage, type Lang } from "./lang";

// Langue de la requête : cookie posé par le sélecteur, sinon langue du navigateur
export async function getLang(): Promise<Lang> {
    const cookie = (await cookies()).get(LANG_COOKIE)?.value;
    if (isLang(cookie)) return cookie;
    return langFromAcceptLanguage((await headers()).get("accept-language"));
}
