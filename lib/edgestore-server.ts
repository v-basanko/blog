import {initEdgeStoreClient} from '@edgestore/server/core';
import {createEdgeStoreNextHandler} from "@edgestore/server/adapters/next/app";
import {initEdgeStore} from "@edgestore/server";

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
    publicFiles: es.fileBucket().beforeDelete(() => true),
});


export const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export const backendClient = initEdgeStoreClient({
    router: edgeStoreRouter,
});

export type EdgeStoreRouter = typeof edgeStoreRouter;