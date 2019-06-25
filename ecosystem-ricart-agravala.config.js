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
    },
    development: {
      user: "bitnami",
      host: hosts[i],
      ref: "origin/master",
      repo: "git@github.com:rrudol/ricart-agravala.git",
      path: "/var/www/ricart-agravala",
      "post-deploy": "npm install"
    }
  }))
  .map((node, i, nodes) => ({
    ...node,
    env: { ...node.env, nodes: JSON.stringify(nodes) }
  }));

module.exports = {
  apps: nodes
};
