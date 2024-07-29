import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
// import ChangePassword from 'src/pages/changePassword';

export const IndexPage = lazy(() => import('src/pages/app'));
export const Categories = lazy(() => import('src/pages/categories'));
export const ChangePassword = lazy(() => import('src/pages/changePassword'));
export const CreateCategory = lazy(() => import('src/pages/createCategory'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const CreateBlog = lazy(() => import('src/pages/createblog'));
export const EditBlog = lazy(() => import('src/pages/editblog'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        // { element: <IndexPage />, index: true },
        // {  path: ''  , element: <LoginPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'dashboard', element: <IndexPage /> },
        { path: 'changePassword', element: <ChangePassword /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'blog/create', element: <CreateBlog /> },
        { path: 'category/create', element: <CreateCategory /> },
        { path: 'categories', element: <Categories /> },
        {
          path: 'editblog/:id',
          element: <EditBlog />,
        },
      ],
    },
    {
      path: '',
      element: <LoginPage />,
    },
    {
      path: 'dashboard',
      element: <IndexPage />,
    },
    { path: 'changePassword', element: <ChangePassword /> },
    {
      path: 'blog/create',
      element: <CreateBlog />,
    },
    {
      path: 'editblog/:id',
      element: <EditBlog />,
    },
    {
      path: 'category/create',
      element: <CreateCategory />,
    },
    {
      path: 'categories',
      element: <Categories />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
