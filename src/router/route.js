// 登录
const Login = resolve => {
  import('page/login/login').then(module => {
    resolve(module)
  })
}
// 404
const NotFound = resolve => {
  import('page/404').then(module => {
    resolve(module)
  })
}
// 主体
const Layout = resolve => {
  import('components/layout/layout').then(module => {
    resolve(module)
  })
}
// 首页
const Home = resolve => {
  import('page/home/home').then(module => {
    resolve(module)
  })
}
// 单次课
const Course = resolve => {
  import('page/course/index').then(module => {
    resolve(module)
  })
}
// 单次课详情
const CourseDetails = resolve => {
  import('page/course/details').then(module => {
    resolve(module)
  })
}
// 新建单次课
const AddCourse = resolve => {
  import('page/course/add').then(module => {
    resolve(module)
  })
}
//系列课
const Series = resolve => {
  import('page/series/index').then(module => {
    resolve(module)
  })
}
//系列课详情
const seriesDetails = resolve => {
  import('page/series/details').then(module => {
    resolve(module)
  })
}
// 新建系列课
const addSeries = resolve => {
  import('page/series/add').then(module => {
    resolve(module)
  })
}
// 系列课时详情
const periodDetails = resolve => {
  import('page/series/period').then(module => {
    resolve(module)
  })
}
// 系列课时编辑
const periodEdit = resolve => {
  import('page/series/update-period').then(module => {
    resolve(module)
  })
}
// 系列课新增课时
const periodAdd = resolve => {
  import('page/series/add-period').then(module => {
    resolve(module)
  })
}
// 修改单课程
const updateCourse = resolve => {
  import('page/course/update').then(module => {
    resolve(module)
  })
}
// 修改系列课
const updateSeries = resolve => {
  import('page/series/update').then(module => {
    resolve(module)
  })
}
export default [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
      },
      {
        path: '/course',
        name: 'course',
        component: Course
      },
      {
        path: '/course/details/:id',
        name: 'courseDetails',
        component: CourseDetails
      },
      {
        path: '/course/add',
        name: 'addCourse',
        component: AddCourse
      },
      {
        path: '/course/update/:id',
        name: 'updateCourse',
        component: updateCourse
      },
      {
        path: '/series',
        name: 'series',
        component: Series
      },
      {
        path: '/series/details/:id',
        name: 'seriesDetails',
        component: seriesDetails
      },
      {
        path: '/series/add',
        name: 'addSeries',
        component: addSeries
      },
      {
        path: '/series/update/:id',
        name: 'updateSeries',
        component: updateSeries
      },
      {
        path: '/series/period/details/:id',
        name: 'periodDetails',
        component: periodDetails
      },
      {
        path: '/series/period/edit/:id',
        name: 'periodEdit',
        component: periodEdit
      },
      {
        path: '/series/period/add/:id',
        name: 'periodAdd',
        component: periodAdd
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    components: {
      blank: Login
    }
  },
  {
    path: '*',
    component: NotFound
  }
]
