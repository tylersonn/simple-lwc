import { api, LightningElement } from 'lwc';

const columns = [
    { label: 'ID', fieldName: 'taskid' },
    { label: 'Title', fieldName: 'taskName' },
    { label: 'Duedate', fieldName: 'dueDate', type: 'date' },
    { label: 'Completed', fieldName: 'completed' },
    {
        type: "button", label: 'Actions', initialWidth: 100, typeAttributes: {
            label: 'Done',
            name: 'Done',
            title: 'Done',
            disabled: false,
            value: 'done',
            iconPosition: 'left',
            iconName:'utility:check',
            variant:'Brand'
        }
    },
    {
        type: "button", label: 'Actions', initialWidth: 100, typeAttributes: {
            label: 'Delete',
            name: 'Delete',
            title: 'Delete',
            disabled: false,
            value: 'Delete',
            iconPosition: 'left',
            iconName:'utility:delete',
            variant:'Brand'
        }
    },
   
];

export default class TaskList extends LightningElement {
    @api taskArray;

    // connectedCallback() {
    //     console.log(JSON.stringify(this.taskArray), 'from list')
    // }

    columns = columns;

    setTasktodue(id){
        const taskEvent = new CustomEvent("taskaction", { detail: id, bubbles: true } )
        this.dispatchEvent(taskEvent)
    }
    removeTask(id) {
        const taskEvent = new CustomEvent("taskdelete", { detail: id, bubbles: true } )
        this.dispatchEvent(taskEvent)
    }

    callRowAction(event) {
        const recId = event.detail.row.taskid;
        // console.log(JSON.stringify(event.detail))
        const actionName = event.detail.action.name;
        if (actionName === 'Done') {
            this.setTasktodue(recId)
        }
        else if(actionName === 'Delete'){
            this.removeTask(recId)
        }
    }

}