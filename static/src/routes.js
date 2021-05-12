/* eslint new-cap: 0 */

import React from 'react';
import { Route } from 'react-router';

/* containers */
import { App } from './containers/App';
import { HomeContainer } from './containers/HomeContainer';
import { TutorialDoneContainer } from './containers/TutorialDoneContainer';

/* components */
import AnnotationView from './components/Annotation/AnnotationView';
import FilesViewer from './components/Files/FilesViewer';
import NotFound from './components/NotFound';
import TutorialView from './components/Tutorial/TutorialView';
import TutorialAnnotation from './components/Tutorial/TutorialAnnotation';
import TutorialExplanation from './components/Tutorial/TutorialExplanation';

export default (
    <Route path="/" component={App}>
        <Route path="main" component={HomeContainer} />
        <Route path="home" component={HomeContainer} />
        <Route path="filesView" component={FilesViewer} />
        <Route path="annotation" component={AnnotationView} />
        <Route path="annotation/:fileId" component={AnnotationView} />
        <Route path="tutorial" component={TutorialView} />
        <Route path="tutorial/done" component={TutorialDoneContainer} />
        <Route path="tutorial/:userId/:fileId" component={TutorialAnnotation} />
        <Route path="tutorial/explanation/:userId/:fileId" component={TutorialExplanation} />
        <Route path="*" component={NotFound} />
    </Route>
);
