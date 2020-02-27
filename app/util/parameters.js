/*
  Our Rails api expects the create/update
  requests to be formatted in a certain way
*/

// export function createParams(state) {
//   return {
//     graph_data: state.graph,
//     attributes: {
//       title: state.attributes.title,
//       description: state.attributes.subtitle,
//       is_private: state.attributes.settings.private,
//       is_cloneable: state.attributes.settings.clone
//     }
//   }
// }

// export function updateParams(state) {
//   return {
//     id: state.attributes.id,
//     graph_data: state.graph,
//     attributes: {
//       title: state.attributes.title,
//       description: state.attributes.subtitle,
//       is_private: state.attributes.settings.private,
//       is_cloneable: state.attributes.settings.clone
//     }
//   }
// }


// export default {
//   create: createParams,
//   update: updateParams
//}

export default function(state) {
  return {
    id: state.attributes.id,
    graph_data: state.graph,
    attributes: {
      title: state.attributes.title,
      description: state.attributes.subtitle,
      is_private: state.attributes.settings.private,
      is_cloneable: state.attributes.settings.clone
    }
  }
}
