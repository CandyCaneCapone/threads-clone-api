function getPublicIdFromUrl(url: string): string {
  const regex = /\/([^/]+?)\.(\w+)(?:$|\?)/;
  const match = url.match(regex);
  return match ? match[1] : "";
}


export default getPublicIdFromUrl ; 