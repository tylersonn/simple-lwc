import { LightningElement, track, wire } from 'lwc';
import saveTasks from '@salesforce/apex/ObjectManagerService.saveTasks';
import getTasks from '@salesforce/apex/ObjectManagerService.getTasks';
import updateTask from '@salesforce/apex/ObjectManagerService.updateTask';
import setTaskToCompleted from '@salesforce/apex/ObjectManagerService.setTaskToCompleted';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TodoManager extends LightningElement {
    @track taskArray = [];
    @track error;
    wiredTasksResult;

    generateRandomNumber() {
        // Generate a random number between 10000 and 99999
        return Math.floor(10000 + Math.random() * 90000);
    }

    handleUpdateTasks(event) {
        const task = event.detail;

        // Add isDeleted property
        task.isdeleted = "false";

        // this.taskArray = [...this.taskArray, task]
        
        this.saveTasksToApex(task);
    }

    @wire(getTasks)
    wiredTasks(result) {
        this.wiredTasksResult = result;
        const { error, data } = result;
        
        if (data) {
            this.taskArray = data.map(task => ({
                taskid: task.Id__c,
                taskName: task.Name,
                dueDate: task.duedate__c,
                completed: task.completed__c,
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.taskArray = [];
        }
    }


    deleteTask(event) {
        const taskid = event.detail;
        const taskToUpdate = this.taskArray.find(task => task.taskid === taskid);

        if(taskToUpdate){
            updateTask({ taskId: taskid, isDeleted: true })
            .then(() => {
                return refreshApex(this.wiredTasksResult);
            })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: `Task ${taskToUpdate.taskName} Deleted`,
                        variant: 'success'
                    }));
            })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error Deleting task',
                            message: 'error deleting task',
                            variant: 'error'
                        })
                    )
                    // Revert the optimistic update if there was an error
                    refreshApex(this.wiredTasksResult);
                });
        }

    }

    removeFromTask(event) {
        const taskid = event.detail;
        const taskToUpdate = this.taskArray.find(task => task.taskid === taskid);
        
        if (taskToUpdate) {
            // console.log(`Task "${taskid}" marked as completed.`);
            setTaskToCompleted({ taskId: taskid, isComplete: true })
            .then(() => {
                
                return refreshApex(this.wiredTasksResult);
            })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: `Task ${taskToUpdate.taskName} Completed`,
                        variant: 'success'
                    }));
                
            })
                .catch(error => {
                    console.error('Error updating task:', error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error Completing task',
                            message: error.message || 'error updating task',
                            variant: 'error'
                        })
                    )
                    // Revert the optimistic update if there was an error
                    refreshApex(this.wiredTasksResult);
                });
            
        }
    }

    saveTasksToApex(task) {
        const tasksJSON = JSON.stringify(task);

        saveTasks({ tasksJSON: tasksJSON })
            .then(() => {
                refreshApex(this.wiredTasksResult);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Task Saved',
                        variant: 'success'
                    }));
            })
            .catch(error => {
                console.error('Error saving tasks', error);
            });
    }

}