const hosts = ["35.157.109.195", "18.184.146.196"];

const nodes = Array(2)
  .fill(1)
  .map(({}, i) => ({
    name: `Ricart-Agravala ${i}`,
    script: "./ricart-agravala.js",
    env: {
      token: i === 0 ? "true" : "",
      id: "" + i,
      port: 5000,
      address: hosts[i]
    }
  }))
  .map((node, i, nodes) => ({
    ...node,
    env: { ...node.env, nodes: JSON.stringify(nodes) }
  }))
  .map((node, i) => {
    node[`env_prod` + i] = node.env;
    return node;
  });

const deploy = Array(2)
  .fill(1)
  .map((_, i) => ({
    key: `prod${i}`,
    user: "bitnami",
    host: hosts[i],
    ref: "origin/master",
    repo: "https://github.com/rrudol/ricart-agravala.git",
    path: "/tmp/www/ricart-agravala",
    "post-deploy": `npm install && pm2 startOrRestart ecosystem.json --env prod${i}`
  }))
  .reduce((a, c) => {
    a[c.key] = c;
    return a;
  }, {});

console.log({ apps: nodes, deploy });

module.exports = {
  apps: nodes,
  deploy
};
