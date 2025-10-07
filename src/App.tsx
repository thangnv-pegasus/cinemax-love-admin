import { Route, Routes } from "react-router"
import { privateRoutes, publicRoutes } from "./config/routes"
import DefaultLayout from "./components/layout/default";
import DashboardLayout from "./components/layout/dashboard";
import { GuestOnly } from "./components/loader/guest-onlyl";
import { RequiredAuth } from "./components/loader/required-auth";

function App() {

  return (
    <>
      <Routes>
        <Route element={<GuestOnly />}>
          <Route element={<DefaultLayout />}>
            {
              publicRoutes.map((route, index) => {
                const Page = route.component;
                if (!Page) return null;
                return <Route key={`public-route-${index}`} path={route.path} element={<Page />} />;
              })
            }
          </Route>
        </Route>
        <Route element={<RequiredAuth />}>
          <Route element={<DashboardLayout />}>
            {
              privateRoutes.map((route, index) => {
                const Page = route.component;
                if (!Page) return null;
                return <Route key={`private-route-${index}`} path={route.path} element={<Page />} />;
              })
            }
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
