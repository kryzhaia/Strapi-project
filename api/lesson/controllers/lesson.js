'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.lesson.search(ctx.query);
    } else {
      entities = await strapi.services.lesson.find(ctx.query);
    }


    

    if (!ctx.state.user) {
        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.lesson }));
    }

    const { id } = ctx.state.user;

    let user = await strapi.plugins['users-permissions'].services.user.fetch({
        id,
    });
    
    let filterdEntities = [];

    entities.forEach(entity => {
        const lessonAccessList = entity.access_levels;

        lessonAccessList.forEach(access => {
    if (access.id === user.user_access.access_levels) {
        filterdEntities.push(entity);   
    } 
        });       
    });
    console.log(filterdEntities);

    return filterdEntities.map(entity => {
        sanitizeEntity(entity, { model: strapi.models.lesson })
        console.log(entity);
        return entity;
    }
    );
  },
};
