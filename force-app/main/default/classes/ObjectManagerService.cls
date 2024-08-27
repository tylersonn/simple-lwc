public with sharing class ObjectManagerService {
    @AuraEnabled
    public static void saveTasks(String tasksJSON) {
        Map<String, Object> task = (Map<String, Object>)JSON.deserializeUntyped(tasksJSON);

        Task__c newTodo = new Task__c(
            Name = (String)task.get('taskName'),
            duedate__c = Date.valueOf((String)task.get('dueDate')),
            completed__c = Boolean.valueOf((String)task.get('completed')),
            isdeleted__c = Boolean.valueOf((String)task.get('isdeleted'))
        );

        // System.debug('Value of myVariable: ' + newTodo);
        
        insert newTodo;

    }

    @AuraEnabled(cacheable=true)
    public static List<Task__c> getTasks() {
        return [SELECT Id__c, Name, duedate__c, completed__c, isdeleted__c
                FROM Task__c
                WHERE isdeleted__c = false
                ORDER BY duedate__c ASC
                LIMIT 1000];
    }

    @AuraEnabled
    public static void updateTask(String taskId, Boolean isDeleted) {
        try {
            // Fetch the existing task
            Task__c taskToUpdate = [SELECT Id, Name, duedate__c, completed__c, isdeleted__c 
                                    FROM Task__c 
                                    WHERE Id__c = :taskId 
                                    LIMIT 1];
            
            if (taskToUpdate != null) {
                // Update the isDeleted field
                taskToUpdate.isDeleted__c = isDeleted;
                
                // Perform the update
                update taskToUpdate;
                
                System.debug('Task updated successfully: ' + taskToUpdate);
            } else {
                throw new AuraHandledException('Task not found with Id: ' + taskId);
            }
        } catch (Exception e) {
            System.debug('Error updating task: ' + e.getMessage());
            throw new AuraHandledException('Error updating tasks: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void setTaskToCompleted(String taskId, Boolean isComplete) {
        try {
            // Fetch the existing task
            Task__c taskToUpdate = [SELECT Id, Name, duedate__c, completed__c, isdeleted__c 
                                    FROM Task__c 
                                    WHERE Id__c = :taskId 
                                    LIMIT 1];
            
            if (taskToUpdate != null) {
                // Update the isDeleted field
                taskToUpdate.completed__c = isComplete;
                
                // Perform the update
                update taskToUpdate;
                
                System.debug('Task updated successfully: ' + taskToUpdate);
            } else {
                throw new AuraHandledException('Task not found with Id: ' + taskId);
            }
        } catch (Exception e) {
            System.debug('Error updating task: ' + e.getMessage());
            throw new AuraHandledException('Error updating tasks: ' + e.getMessage());
        }
    }
}

// how to take the data from js to apex
// and apex saves the data in sf

// javascript request for data from apex
// and apex queries data from object manager

// SF inspector