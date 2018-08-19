import { updateProjectRequest } from '../redux/actions/projectActions';

export function updateProjectModificationDate(store, cardId) {
    const card = store.getState().cards.byId[cardId];
    const project = store.getState().projects.byId[card.project];
    
    const updatedProject = Object.assign({}, project, {
        lastModified: Date.now().toString()
    });
    delete updatedProject.cards;

    store.dispatch(updateProjectRequest(updatedProject.id, updatedProject));
}