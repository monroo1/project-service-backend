/**
 * This file was automatically generated by Strapi.
 * Any modifications made will be discarded.
 */
import usersPermissions from "@strapi/plugin-users-permissions/strapi-admin";
import i18N from "@strapi/plugin-i18n/strapi-admin";
import strapiCloud from "@strapi/plugin-cloud/strapi-admin";
import { renderAdmin } from "@strapi/strapi/admin";

import customisations from "../../src/admin/app.tsx";

renderAdmin(document.getElementById("strapi"), {
  customisations,
  plugins: {
    "users-permissions": usersPermissions,
    i18n: i18N,
    "strapi-cloud": strapiCloud,
  },
});
