export async function fetchJson(url, opts = {}){
  try{
    const res = await fetch(url, opts);
    const text = await res.text();
    let data = null;
    try{ data = text ? JSON.parse(text) : null; }catch(e){ data = { raw: text }; }
    if (!res.ok){
      const err = (data && data.error) || (data && data.message) || HTTP ${res.status};
      const error = new Error(err);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  }catch(e){ throw e; }
}
