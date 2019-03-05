export default function(server) {
  const composition = server.create('composition', {
    title: 'My Cool Design',
    width: 500,
    height: 500
  });

  server.createList('layer', 4, { composition });
  server.create('layer', {
    composition,
    left: 0,
    top: 0,
    width: 50,
    height: 50,
    rotation: 0,
    color: 'white'
  });

  server.create('layer', {
    composition,
    left: 250,
    top: 250,
    width: 250,
    height: 250,
    rotation: 0,
    color: 'white'
  });
}
