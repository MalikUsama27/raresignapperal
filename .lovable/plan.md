# Natural, trustworthy blog images

## Goal
Blog featured images should look like real photos from a working sportswear factory, not AI artwork, so buyers trust the articles.

## What changes
1. Review every published blog's featured image (12 posts) and mark the ones that look artificial (glossy, perfect, fake text, odd hands or stitching).
2. Replace those with documentary-style photos: real factory floor light, slightly imperfect framing, workers' hands at sewing machines, fabric rolls, cutting tables, sublimation printers, packed cartons, finished hoodies/tracksuits/basketball kits on racks. No text, logos or faces close-up inside the image.
3. Give the 2 newest posts (basketball bulk guide, winter hoodies & tracksuits guide) their own images instead of reused ones.
4. If you send real photos from your factory, those are used first in place of new pictures — real photos build the most trust.
5. Improve each image's description (alt text) to describe what is actually shown.

## Not changed
Blog text, titles, SEO details, layout, design and other site images.

## Technical details
- New images saved under `public/images/` with descriptive names; `blog_posts.cover_image_url` updated per slug.
- Old image files kept until the new ones are confirmed.
- Cover `alt` in `src/routes/blog/$slug.tsx` and blog cards stays tied to the post title plus a short scene description.
