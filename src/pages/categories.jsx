import { Helmet } from 'react-helmet-async';

import CategoriesView from 'src/sections/category/CategoryView';

// ----------------------------------------------------------------------

export default function Categories() {
  return (
    <>
      <Helmet>
        <title> Categories </title>
      </Helmet>

      <CategoriesView />
    </>
  );
}
