import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'Create blog',
    path: '/blog/create',
    icon: icon('ic_blog'),
  },
  {
    title: 'Categories',
    path: '/categories',
    icon: icon('ic_lock'),
  },
  {
    title: 'Create Category',
    path: '/category/create',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
