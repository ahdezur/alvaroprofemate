const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', err => reject(err));
  });
}

async function testApi() {
  console.log("1. Testing GET /api/posts...");
  const postsRes = await fetchUrl("https://alvaroprofemate.netlify.app/api/posts");
  console.log("GET /api/posts status:", postsRes.status);

  console.log("\n2. Testing GET /api/courses?courseId=calculo-multivariable...");
  const courseRes = await fetchUrl("https://alvaroprofemate.netlify.app/api/courses?courseId=calculo-multivariable");
  console.log("GET /api/courses status:", courseRes.status);
  console.log("Course structure units count:", courseRes.json && courseRes.json.units ? courseRes.json.units.length : "NO UNITS");

  if (courseRes.json && courseRes.json.units) {
    console.log("Units:", courseRes.json.units.map(u => ({ id: u.id, unitIndex: u.unitIndex, title: u.title, chaptersCount: u.chapters.length })));
  }

  console.log("\n3. Testing GET /api/courses?courseId=calculo-multivariable&chapterIndex=1.1...");
  const chapRes = await fetchUrl("https://alvaroprofemate.netlify.app/api/courses?courseId=calculo-multivariable&chapterIndex=1.1");
  console.log("GET /api/courses (chap 1.1) status:", chapRes.status);
  console.log("Chapter 1.1 title:", chapRes.json ? chapRes.json.title : "NO CHAPTER DATA");
}

testApi();
