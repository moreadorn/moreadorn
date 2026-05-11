import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Products } from "./pages/Products";
import { Markets } from "./pages/Markets";
import { Blog } from "./pages/Blog";
import { Contact } from "./pages/Contact";
import { Policies } from "./pages/Policies";
import { NotFound } from "./pages/NotFound";

import { AdminLayout } from "./admin/AdminLayout";
import { Login as AdminLogin } from "./admin/pages/Login";
import { Dashboard as AdminDashboard } from "./admin/pages/Dashboard";
import { ProductsList } from "./admin/pages/products/ProductsList";
import { ProductForm } from "./admin/pages/products/ProductForm";
import { MarketsList } from "./admin/pages/markets/MarketsList";
import { MarketForm } from "./admin/pages/markets/MarketForm";
import { BlogsList } from "./admin/pages/blogs/BlogsList";
import { BlogForm } from "./admin/pages/blogs/BlogForm";
import { PoliciesList } from "./admin/pages/policies/PoliciesList";
import { PolicyForm } from "./admin/pages/policies/PolicyForm";
import { Address as AdminAddress } from "./admin/pages/Address";
import { SocialMedia as AdminSocialMedia } from "./admin/pages/SocialMedia";
import { AiKeys as AdminAiKeys } from "./admin/pages/AiKeys";
import { EmailConfigs as AdminEmailConfigs } from "./admin/pages/EmailConfigs";
import { ProductQuotesList } from "./admin/pages/productQuotes/ProductQuotesList";

export const router = createBrowserRouter([
  // Admin login (standalone, no shell)
  { path: "/admin/login", Component: AdminLogin },

  // Admin app (with sidebar + topbar)
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "dashboard", Component: AdminDashboard },
      { path: "products", Component: ProductsList },
      { path: "products/new", Component: ProductForm },
      { path: "products/:id/edit", Component: ProductForm },
      { path: "markets", Component: MarketsList },
      { path: "markets/new", Component: MarketForm },
      { path: "markets/:id/edit", Component: MarketForm },
      { path: "blogs", Component: BlogsList },
      { path: "blogs/new", Component: BlogForm },
      { path: "blogs/:id/edit", Component: BlogForm },
      { path: "policies", Component: PoliciesList },
      { path: "policies/new", Component: PolicyForm },
      { path: "policies/:id/edit", Component: PolicyForm },
      { path: "request-quotes", Component: ProductQuotesList },
      { path: "address", Component: AdminAddress },
      { path: "social", Component: AdminSocialMedia },
      { path: "ai-keys", Component: AdminAiKeys },
      { path: "email-configs", Component: AdminEmailConfigs },
    ],
  },

  // Public site
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "products", Component: Products },
      { path: "markets", Component: Markets },
      { path: "blog", Component: Blog },
      { path: "contact", Component: Contact },
      { path: "policies", Component: Policies },
      { path: "*", Component: NotFound },
    ],
  },
]);
