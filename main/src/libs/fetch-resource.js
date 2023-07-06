export const fetchResource = async (url) =>
  await fetch(url).then((res) =>{
    return res.text()
  });
