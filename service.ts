// college.service.ts
import axios from 'axios';

export async function getColleges() {
  const external = await axios.get('https://api.example.com/colleges');

  return external.data.map((c: any) => ({
    name: c.name,
    location: c.location,
    rating: c.rating,
  }));
}