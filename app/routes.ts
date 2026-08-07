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
  route("new/account-creation", "routes/user/signup.tsx"),
  route("savings/referrals", "routes/learn-more.tsx"),
  route("admin/login", "routes/admin/form/login.tsx"),

  layout("./Layouts/user-layout.tsx", [
    ...prefix("user", [
      route("dashboard", "routes/user/dashboard.tsx"),
      route("transfer", "routes/user/transfer.tsx"),
      route("help", "routes/user/help.tsx"),
      route("profile", "routes/user/profile.tsx"),
      route("transaction/:id", "routes/user/transaction-details.tsx"),

    ])
  ]),
  layout("./Layouts/admin-layout.tsx", [
    ...prefix("admin", [
      route("dashboard", "routes/admin/dashboard.tsx"),
      route("withdraw", "routes/admin/withdraw/all-withdraw.tsx"),
      route("transaction", "routes/admin/transaction/all-transact.tsx"),
      route("all-user", "routes/admin/users/all-user.tsx"),
      route("all-user/:id", "routes/admin/users/single-user.tsx"),
      route("all-user-kyc", "routes/admin/kyc/all-kyc.tsx"),
      route("single-mail", "routes/admin/mailing/single-mail.tsx"),
      route("broadcast-mail", "routes/admin/mailing/broadcast.tsx"),

    ])
  ]),

] satisfies RouteConfig;
