var map = {"id":1,"title":"A Map with Summers at the Center","description":"There he is, cooly observing the universe's unfolding flow of value, surrounded by his comrades.","entities":[{"id":8,"name":"Citigroup","image":"//s3.amazonaws.com/pai-littlesis/images/profile/52dc19487c1d2be4fd1c4f4e7c5d55e439e2f4e1_1364345171.png","url":"/org/8/Citigroup","description":"Major American bank","x":425.99107595391,"y":58.07969660667001,"fixed":true,"type":"Org","hide_image":false,"custom":false,"scale":null},{"id":20,"name":"Goldman Sachs","image":"//s3.amazonaws.com/pai-littlesis/images/profile/aa7357327a0bea2e980d88d5148388ab94be32fa_1364345344.png","url":"/org/20/Goldman_Sachs","description":"Investment firm","x":643.081282989,"y":203.61018596298,"fixed":true,"type":"Org","hide_image":false,"custom":false,"scale":null},{"id":1164,"name":"Robert E Rubin","image":"//s3.amazonaws.com/pai-littlesis/images/profile/7b849b0b7ae17426cd4a2823be9ba2fcea730894_1364323240.png","url":"/person/1164/Robert_E_Rubin","description":"Former Treasury Secretary; co-chair of Council on Foreign Relations","x":520.17900020674,"y":404.23843675399,"fixed":true,"type":"Person","hide_image":false,"custom":false,"scale":null},{"id":14597,"name":"Larry Summers","image":"//s3.amazonaws.com/pai-littlesis/images/profile/08199ea9dfff482d1827d9287d2f2a76fb53f5b7_1364345016.png","url":"/person/14597/Larry_Summers","description":"formerly Director of the National Economic Council","x":412.39689997598,"y":228.97349682093,"fixed":true,"type":"Person","hide_image":false,"custom":false,"scale":null},{"id":14629,"name":"U.S. Department of the Treasury","image":"//s3.amazonaws.com/pai-littlesis/images/profile/74402be62c538297d255fd6af12f31caefe84127_1231786312.png","url":"/org/14629/U.S._Department_of_the_Treasury","description":null,"x":272.7536806436,"y":405.64554250851,"fixed":true,"type":"Org","hide_image":false,"custom":false,"scale":null},{"id":28219,"name":"Tim Geithner","image":"//s3.amazonaws.com/pai-littlesis/images/profile/f7a5192ceee0c32fa76b7f9475c5cf55786c53f0_1227571772.png","url":"/person/28219/Tim_Geithner","description":"Treasury Secretary","x":184.31590096901,"y":249.14607871485,"fixed":true,"type":"Person","hide_image":false,"custom":false,"scale":null}],"rels":[{"id":26043,"entity1_id":8,"entity2_id":14629,"category_id":6,"category_ids":[6],"is_current":null,"is_directional":null,"end_date":null,"scale":null,"label":"Transaction, Lobbying","url":"/relationship/view/id/26043","x1":null,"y1":null,"fixed":true,"custom":false},{"id":34422,"entity1_id":20,"entity2_id":14629,"category_id":7,"category_ids":[7],"is_current":null,"is_directional":null,"end_date":null,"scale":null,"label":"Lobbying","url":"/relationship/view/id/34422","x1":null,"y1":null,"fixed":true,"custom":false},{"id":192,"entity1_id":1164,"entity2_id":8,"category_id":1,"category_ids":[1],"is_current":1,"is_directional":null,"end_date":null,"scale":null,"label":"Position","url":"/relationship/view/id/192","x1":null,"y1":null,"fixed":true,"custom":false},{"id":90187,"entity1_id":1164,"entity2_id":20,"category_id":1,"category_ids":[1],"is_current":0,"is_directional":null,"end_date":null,"scale":null,"label":"Position","url":"/relationship/view/id/90187","x1":null,"y1":null,"fixed":true,"custom":false},{"id":26319,"entity1_id":1164,"entity2_id":14629,"category_id":1,"category_ids":[1],"is_current":0,"is_directional":null,"end_date":null,"scale":null,"label":"Position","url":"/relationship/view/id/26319","x1":null,"y1":null,"fixed":true,"custom":false},{"id":123315,"entity1_id":14597,"entity2_id":8,"category_id":6,"category_ids":[6],"is_current":0,"is_directional":null,"end_date":null,"scale":null,"label":"Transaction","url":"/relationship/view/id/123315","x1":null,"y1":null,"fixed":true,"custom":false},{"id":123314,"entity1_id":14597,"entity2_id":20,"category_id":6,"category_ids":[6],"is_current":0,"is_directional":null,"end_date":null,"scale":null,"label":"Transaction","url":"/relationship/view/id/123314","x1":null,"y1":null,"fixed":true,"custom":false},{"id":90126,"entity1_id":14597,"entity2_id":1164,"category_id":9,"category_ids":[9],"is_current":null,"is_directional":null,"end_date":null,"scale":null,"label":"Professional","url":"/relationship/view/id/90126","x1":null,"y1":null,"fixed":true,"custom":false},{"id":26336,"entity1_id":14597,"entity2_id":14629,"category_id":1,"category_ids":[1],"is_current":0,"is_directional":null,"end_date":null,"scale":null,"label":"Position","url":"/relationship/view/id/26336","x1":null,"y1":null,"fixed":true,"custom":false},{"id":594163,"entity1_id":28219,"entity2_id":1164,"category_id":1,"category_ids":[1],"is_current":0,"is_directional":null,"end_date":null,"scale":null,"label":"Position","url":"/relationship/view/id/594163","x1":null,"y1":null,"fixed":true,"custom":false},{"id":594164,"entity1_id":28219,"entity2_id":14597,"category_id":1,"category_ids":[1],"is_current":0,"is_directional":null,"end_date":null,"scale":null,"label":"Position","url":"/relationship/view/id/594164","x1":null,"y1":null,"fixed":true,"custom":false},{"id":93212,"entity1_id":28219,"entity2_id":14629,"category_id":1,"category_ids":[1],"is_current":1,"is_directional":null,"end_date":null,"scale":null,"label":"Position","url":"/relationship/view/id/93212","x1":null,"y1":null,"fixed":true,"custom":false}],"texts":[]};


var transformData = function(data) {
  let nodes =  data.entities.map(function(e) {
    return {
      id: e.id,
      display: { name: e.name }
    };
  });

  let edges = data.rels.map(function(r) {
    return {
      id: r.id,
      n1: r.entity1_id,
      n2: r.entity2_id,
      display: { label: r.label }
    }
  });

  return {
    id: data.id,
    title: data.title,
    nodes: nodes,
    edges: edges
  };
};

var data = transformData(map);

window.graph_data = data;

export default data;