import { api, LightningElement } from 'lwc';

export default class CreateTask extends LightningElement {

    @api taskArray;

    titleTask;
    dueDate;
    showDueDate = false
    showSaveBtn = false

    connectedCallback() {
        // console.log(this.taskArray, 'this is it')
    }

    handleOnChange(event) {
        const fieldname = event.target.name;

        if(fieldname === 'taskName'){
            this.titleTask = event.target.value
            this.showDueDate = !!this.titleTask
        }

        if(fieldname === 'dueDate'){
            this.dueDate = event.target.value
            this.showSaveBtn = !!this.dueDate
        }
    }

    @api saveTask() {
        const newTask = { taskName: this.titleTask, dueDate: this.dueDate, completed: "false" }
       
        const taskEvent = new CustomEvent("update", { detail: newTask, bubbles: true } )
        this.dispatchEvent(taskEvent)

        this.titleTask = ''
        this.dueDate = ''
       
    }

}