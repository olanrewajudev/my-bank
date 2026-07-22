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
            route("login", "routes/user/login.tsx"),
  layout("./Layouts/user-layout.tsx", [
    ...prefix("user", [
      route("dashboard", "routes/user/dashboard.tsx"),
      route("transfer", "routes/user/transfer.tsx"),
      route("help", "routes/user/help.tsx"),
      route("profile", "routes/user/profile.tsx"),

    ])
  ]),

] satisfies RouteConfig;
