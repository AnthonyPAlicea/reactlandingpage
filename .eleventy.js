const { EleventyRenderPlugin } = require("@11ty/eleventy");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { EleventyEdgePlugin } = require("@11ty/eleventy");


module.exports = config => {
  
    config.markdownTemplateEngine = "njk";
    config.addPassthroughCopy("assets");
    config.addPassthroughCopy("projects/interface-normalization");
    config.addPassthroughCopy('_redirects');

    config.addFilter('dateDisplay', require('./filters/date-display.js'));

    config.addPlugin(EleventyRenderPlugin);

    config.addPlugin(syntaxHighlight);

    config.addPlugin(pluginRss);

    config.addPlugin(EleventyEdgePlugin);

    config.addCollection('postsWithoutDrafts', (collection) =>
      [...collection.getFilteredByTags("post")].filter(
        (post) => !post.data.draft
      )
    );

    config.addCollection("sortedRecipes", function(collectionApi) {
      return collectionApi.getFilteredByTags("html-recipe").sort((a, b) => {
        return a.data.title.localeCompare(b.data.title);
      });
    });
  
    return {
      pathPrefix: require('./globals/site.json').baseUrl,
      dir: {
        input: './',
        output: '_site',
        includes: 'includes',
        layouts: 'includes/layouts',
        data: 'globals',
      }
    };
  };