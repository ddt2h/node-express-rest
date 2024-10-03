import * as yup from 'yup'

export const createTaskSchema = yup.object({
    title: yup.string().required(),
    status: yup.string().oneOf(['new', 'in progress', 'completed']).required(),
    priority: yup.string().notRequired(),
    dueDate: yup.date().notRequired()
})
