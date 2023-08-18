export interface ITask {
  id: string;
  name: string;
  wasFinished: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface IFieldsTaskUpdated {
  name?: string;
  wasFinished?: boolean;
}
