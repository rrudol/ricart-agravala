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
    env: { ...node.env, nodes: JSON.stringify(nodes) },
    env_production: { ...node.env, nodes: JSON.stringify(nodes) }
  }));

module.exports = {
  apps: nodes,
  deploy: {
    production: {
      user: "bitnami",
      host: hosts,
      ref: "origin/master",
      repo: "https://github.com/rrudol/ricart-agravala.git",
      path: "/tmp/www/ricart-agravala",
      "post-deploy": "npm install"
    }
  }
};
