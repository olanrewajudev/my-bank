import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./Layouts/general-layout.tsx", [
    index("./routes/home.tsx"),
  ]),

] satisfies RouteConfig;
