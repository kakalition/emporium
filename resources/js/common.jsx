import { IconBook, IconCamera, IconCode, IconCube, IconHeadphones, IconLetterCase, IconMusic, IconSearch, IconShoppingCart, IconTemplate, IconUser, IconVector, IconVideo } from "@tabler/icons-react";

class Common {
  static productCategories = [
    {
      "name": "3D Models",
      "icon": <IconCube size={96} />,
      "description": "Downloadable 3D models for various purposes.",
      "slug": "3d-models"
    },
    {
      "name": "E-books",
      "icon": <IconBook size={96} />,
      "description": "Digital books for reading on various devices.",
      "slug": "e-books"
    },
    {
      "name": "Music",
      "icon": <IconMusic size={96} />,
      "description": "Digital music files for listening.",
      "slug": "music"
    },
    {
      "name": "Videos",
      "icon": <IconVideo size={96} />,
      "description": "Digital videos for watching.",
      "slug": "videos"
    },
    {
      "name": "Software",
      "icon": <IconCode size={96} />,
      "description": "Computer programs for various tasks.",
      "slug": "software"
    },
    {
      "name": "Fonts",
      "icon": <IconLetterCase size={96} />,
      "description": "Typefaces for text formatting.",
      "slug": "fonts"
    },
    {
      "name": "Stock Photos",
      "icon": <IconCamera size={96} />,
      "description": "High-quality images for various purposes.",
      "slug": "stock-photos"
    },
    {
      "name": "Templates",
      "icon": <IconTemplate size={96} />,
      "description": "Pre-designed layouts for documents, presentations, and more.",
      "slug": "templates"
    },
    {
      "name": "Audio Samples",
      "icon": <IconHeadphones size={96} />,
      "description": "Sound effects and music clips for use in projects.",
      "slug": "audio-samples"
    },
    {
      "name": "Vector Graphics",
      "icon": <IconVector size={96} />,
      "description": "Scalable graphics for various purposes.",
      "slug": "vector-graphics"
    },
  ]

  static getProductCategories = (size) => [
    {
      "name": "3D Models",
      "icon": <IconCube size={size} />,
      "description": "Downloadable 3D models for various purposes.",
      "slug": "3d-models"
    },
    {
      "name": "E-books",
      "icon": <IconBook size={size} />,
      "description": "Digital books for reading on various devices.",
      "slug": "e-books"
    },
    {
      "name": "Music",
      "icon": <IconMusic size={size} />,
      "description": "Digital music files for listening.",
      "slug": "music"
    },
    {
      "name": "Videos",
      "icon": <IconVideo size={size} />,
      "description": "Digital videos for watching.",
      "slug": "videos"
    },
    {
      "name": "Software",
      "icon": <IconCode size={size} />,
      "description": "Computer programs for various tasks.",
      "slug": "software"
    },
    {
      "name": "Fonts",
      "icon": <IconLetterCase size={size} />,
      "description": "Typefaces for text formatting.",
      "slug": "fonts"
    },
    {
      "name": "Stock Photos",
      "icon": <IconCamera size={size} />,
      "description": "High-quality images for various purposes.",
      "slug": "stock-photos"
    },
    {
      "name": "Templates",
      "icon": <IconTemplate size={size} />,
      "description": "Pre-designed layouts for documents, presentations, and more.",
      "slug": "templates"
    },
    {
      "name": "Audio Samples",
      "icon": <IconHeadphones size={size} />,
      "description": "Sound effects and music clips for use in projects.",
      "slug": "audio-samples"
    },
    {
      "name": "Vector Graphics",
      "icon": <IconVector size={size} />,
      "description": "Scalable graphics for various purposes.",
      "slug": "vector-graphics"
    },
  ]

  static formatToCurrency(value) {
    if (!value) {
      return 0;
    }

    return new Intl.NumberFormat('id-ID').format(value);
  }

  static ifNanZero(value) {
    if (isNaN(value)) {
      return 0;
    }

    return value;
  }
}

export default Common