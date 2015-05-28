class Entity {
  construct(options){
    this.api_uri = options.api_uri; // String
    this.description = options.description; //String
    this.id = options.id; //String
    this.name = options.name; //String
    this.parent_id = options.parent_id; //String
    this.type = options.primary_type || options.type; //String
    this.start_date = options.start_date; //String
    this.summary = options.summary; //String
    this.updated_at = options.updated_at; //String
    this.url = options.uri || options.url; //String
    this.website = options.website; //String
    //only from net_map json --V
    this.image = options.image;
    this.x = options.x;
    this.y = options.y;
    this.fixed = options.fixed;
    this.hide_image = options.hide_image;
    this.custom = options.custom;
    this.scale = options.scale;
  }
}
