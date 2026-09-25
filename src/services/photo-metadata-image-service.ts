import sharp from 'sharp';
import sharpImageService, { resolveSharpEncoderOptions } from 'astro/assets/services/sharp';

type ImageOutputFormat = Awaited<ReturnType<typeof sharpImageService.transform>>['format'];

const creator = 'David Barbosa';
const email = 'davidbarbosa.design@gmail.com';
const rights = `Copyright © ${creator}. All rights reserved.`;
const creatorDescription = `<rdf:Description rdf:about=""
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
  xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
  xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/">
  <dc:creator><rdf:Seq><rdf:li>${creator}</rdf:li></rdf:Seq></dc:creator>
  <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${rights}</rdf:li></rdf:Alt></dc:rights>
  <xmpRights:WebStatement>https://ahbestia.com</xmpRights:WebStatement>
  <photoshop:Credit>${creator}</photoshop:Credit>
  <Iptc4xmpCore:CreatorContactInfo rdf:parseType="Resource">
    <Iptc4xmpCore:CiEmailWork>${email}</Iptc4xmpCore:CiEmailWork>
  </Iptc4xmpCore:CreatorContactInfo>
</rdf:Description>`;

const creatorXmp = `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    ${creatorDescription}
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

const mergeCreatorXmp = (existingXmp?: string) => {
  if (!existingXmp?.includes('</rdf:RDF>')) return creatorXmp;
  if (existingXmp.includes(email)) return existingXmp;
  return existingXmp.replace('</rdf:RDF>', `${creatorDescription}\n</rdf:RDF>`);
};

const fitMap = {
  fill: 'fill',
  contain: 'inside',
  cover: 'cover',
  none: 'outside',
  'scale-down': 'inside',
  outside: 'outside',
  inside: 'inside',
} as const;

const photoMetadataImageService: typeof sharpImageService = {
  ...sharpImageService,
  async transform(...[inputBuffer, transform, config]: Parameters<typeof sharpImageService.transform>) {
    const sourceMetadata = await sharp(inputBuffer).metadata();
    const inputFormat = sourceMetadata.format;
    const outputFormat = transform.format ?? inputFormat;

    if (!outputFormat || outputFormat === 'svg') {
      return { data: inputBuffer, format: inputFormat as ImageOutputFormat };
    }

    const result = sharp(inputBuffer, {
      failOn: 'none',
      pages: -1,
      limitInputPixels: config.service.config.limitInputPixels,
    });

    result.rotate();
    if (transform.width && transform.height) {
      result.resize({
        width: Math.round(transform.width),
        height: Math.round(transform.height),
        kernel: config.service.config.kernel,
        fit: transform.fit ? fitMap[transform.fit as keyof typeof fitMap] ?? 'inside' : undefined,
        position: transform.position,
        withoutEnlargement: true,
      });
    } else if (transform.height) {
      result.resize({
        height: Math.round(transform.height),
        withoutEnlargement: true,
        kernel: config.service.config.kernel,
      });
    } else if (transform.width) {
      result.resize({
        width: Math.round(transform.width),
        withoutEnlargement: true,
        kernel: config.service.config.kernel,
      });
    }

    if (transform.background) result.flatten({ background: transform.background });

    const encoderOptions = resolveSharpEncoderOptions(
      { format: outputFormat, quality: transform.quality },
      inputFormat,
      config.service.config,
    );
    if (outputFormat === 'webp') result.webp(encoderOptions);
    else if (outputFormat === 'png') result.png(encoderOptions);
    else if (outputFormat === 'avif') result.avif(encoderOptions);
    else if (outputFormat === 'jpeg' || outputFormat === 'jpg') result.jpeg(encoderOptions);
    else result.toFormat(outputFormat, encoderOptions);

    // Keep the source EXIF, IPTC, ICC and XMP data. Only the author and
    // copyright fields are updated; the XMP contact block is appended.
    result
      .keepMetadata()
      .withExifMerge({ IFD0: { Artist: creator, Copyright: rights } })
      .withXmp(mergeCreatorXmp(sourceMetadata.xmpAsString));

    const { data, info } = await result.toBuffer({ resolveWithObject: true });
    return { data, format: info.format as ImageOutputFormat };
  },
};

export default photoMetadataImageService;
