
interface HipoUniversity {
  name: string;
  country: string;
  web_pages: string[];
  'state-province': string | null;
}

export async function fetchIndianUniversities() {
  try {
    const response = await fetch('http://universities.hipolabs.com/search?country=India');
    const data = await response.json() as HipoUniversity[];
    return data.map(uni => ({
      name: uni.name,
      website: uni.web_pages[0] || null,
      state: uni['state-province'] || 'Unknown',
      city: uni['state-province'] || 'Unknown',
    }));
  } catch (error) {
    console.error('Failed to fetch from HipoLabs:', error);
    return [];
  }
}
