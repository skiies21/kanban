import api from './index'

//Поменять данное значение на то, которое у вас относится к нужному типу
const SLESARI_ID: string = '21' //Тип "СЛЕСАРИ" ID 8
const PLAN_ID: string = '18' // "В плане" - Status ID 2
const WORK_ID: string = '16' // "В работе" - Status ID 7
const CHECK_ID: string = '24' // "На проверке" - Status ID 5

const QUERY: {}[] = [
    { type_id: { operator: '=', values: [SLESARI_ID] } },
    { status: { operator: '=', values: [PLAN_ID, WORK_ID, CHECK_ID] } },
]

interface IUpdate {
    spentTime?: string
    estimatedTime?: string
    _links?: { status: { href: string } }
    lockVersion: number | undefined
}

export class OpenProjectService {
    //Данные функции отключены так как для данной версии требуется делать запросы только к заданному выше в фильтре запроса типу
    // static async getAllTasks() {
    //   const { data } = await api.get('/projects/test/work_packages');
    //   return data;
    // }

    // static async getAllProjects() {
    //   const { data } = await api.get('/projects');
    //   return data;
    // }

    static async getProjects() {
        let allProjects = []
        let page = 1
        let pageSize = 1000

        while (true) {
            //делаем запрос только для данного типа
            const query = [{ type: { operator: '=', values: [SLESARI_ID] } }]
            const { data } = await api.get('/projects', {
                params: { filters: JSON.stringify(query), page, pageSize },
            })

            allProjects.push(data)
            if (!data || !data.length) {
                break
            }
            page++
        }

        return allProjects
    }

/*

static async getAllTaskByProject(project_id: number) {
        const { status } = await api.get(
    //    const response = await api.get(
            `/projects/${project_id}/work_packages?filters=${JSON.stringify(
                QUERY
            )}`
        )
        let data
        if (status === 200) {
            const response = await api.get(
                `/projects/${project_id}/work_packages?filters=${JSON.stringify(
                    QUERY
                )}`
            )
            data = response.data
        } else {
            const response = await api.get(
                `/projects/${project_id}/work_packages`
            )
            data = response.data || []
        }

        return data
  //      return response.data
    }

*/


       static async getAllTaskByProject(project_id: number) {
        const response = await api.get(
            `/projects/${project_id}/work_packages?filters=${JSON.stringify(
                QUERY
            )}`
        )
        return response.data
    }


    static async updateTask(upd_data: IUpdate, id: number | undefined) {
        const { data } = await api.patch(`work_packages/${id}`, upd_data)
        return data
    }

    static async getTask(id: number | undefined) {
        const { data } = await api.get(`work_packages/${id}`)
        return data
    }

    static async updateTaskToDefault(
        id: number | undefined,
        upd_data: IUpdate
    ) {
        const { data } = await api.patch(`work_packages/${id}`, upd_data)
        return data
    }
    static async updateTime(
        upd_data: {
            hours: string
            spentOn: string
            lockVersion: number | undefined
            _links: { workPackage: { href: string } }
            comment: { format: string; raw: string }
        },
        id: number | undefined
    ) {
        const { data } = await api.post(`/time_entries`, upd_data)
        return data
    }
}
