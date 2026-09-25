import sharp from 'sharp';
import sharpImageService from 'astro/assets/services/sharp';

const creator = 'David Barbosa';
const email = 'davidbarbosa.design@gmail.com';
const rights = `Copyright © ${creator}. All rights reserved.`;

// XMP is broadly understood by photography tools and supports creator contact
// details, which EXIF alone does not standardize.
const creatorXmp = `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
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
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

const photoMetadataImageService: typeof sharpImageService = {
  ...sharpImageService,
  async transform(...[inputBuffer, transform, config]: Parameters<typeof sharpImageService.transform>) {
    const optimized = await sharpImageService.transform(inputBuffer, transform, config);

    // SVGs are passed through by Astro and cannot carry this raster metadata.
    if (optimized.format === 'svg') return optimized;

    const data = await sharp(optimized.data)
      .withExif({
        IFD0: {
          Artist: creator,
          Copyright: rights,
        },
      })
      .withXmp(creatorXmp)
      .toBuffer();

    return { data, format: optimized.format };
  },
};

export default photoMetadataImageService;
