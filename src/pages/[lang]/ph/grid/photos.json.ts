import type { APIRoute } from 'astro';
import { languages, type Lang } from '../../../../i18n/content';
import { prepareArchivePhotos } from '../../../../data/photoArchive';

export function getStaticPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => new Response(
  JSON.stringify(await prepareArchivePhotos(params.lang as Lang)),
  { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
);
