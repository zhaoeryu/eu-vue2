import Layout from '@/layout/index.vue'
import MiddleDirectory from '@/layout/components/MiddleDirectory.vue'
export default {
  path: '/first',
  name: 'First',
  component: Layout,
  meta: {
    title: 'First',
    icon: 'workbench',
  },
  children: [
    {
      path: 'second1',
      name: 'Second1',
      component: MiddleDirectory,
      meta: {
        title: 'Second1',
        icon: 'workbench',
      },
      children: [
        {
          path: 'third1',
          name: 'Second1Third1',
          meta: {
            title: 'Third1',
            icon: 'workbench',
          },
          component: (resolve) => require(['@/views/first/second1/third1'], resolve)
        },
        {
          path: 'third2',
          name: 'Second1Third2',
          meta: {
            title: 'Third2',
            icon: 'workbench',
          },
          component: (resolve) => require(['@/views/first/second1/third2'], resolve)
        }
      ]
    },
    {
      path: 'second2',
      name: 'Second2',
      component: MiddleDirectory,
      meta: {
        title: 'Second2',
        icon: 'workbench',
      },
      children: [
        {
          path: 'third1',
          name: 'Second2Third1',
          meta: {
            title: 'Third1',
            icon: 'workbench',
          },
          component: (resolve) => require(['@/views/first/second2/third1'], resolve)
        },
        {
          path: 'third2',
          name: 'Second2Third2',
          meta: {
            title: 'Third2',
            icon: 'workbench',
          },
          component: (resolve) => require(['@/views/first/second2/third2'], resolve)
        }
      ]
    },
    {
      path: 'second3',
      name: 'Second3',
      meta: {
        title: 'Second3',
        icon: 'workbench',
      },
      component: (resolve) => require(['@/views/first/second3'], resolve)
    }
  ]
}
