from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os, json
import networkx as nx
import utils
from pprint import pprint as printf

app = FastAPI()

origins = [
    "http://localhost:3000",
]

PATHS = None
GRAPH = None
async def startup_event():
    global PATHS, GRAPH
    GRAPH = await utils.create_graph("./assests/final_data.json")
    PATHS = await utils.load_paths("./assests/paths.json")
    print("files loaded")

@app.on_event("startup")
async def on_startup():
    await startup_event()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class ShortestPathNodes(BaseModel):
    source_id: int
    destination_id: int
@app.get('/all/')
async def all_paths():
    return PATHS

@app.post("/shortest/")
async def shortest_path(nodes: ShortestPathNodes):
    source_id, destination_id = nodes.source_id, nodes.destination_id

    paths =  await utils.shortest_path(GRAPH, PATHS, source_id, destination_id)
    return paths

@app.get('/mst/')
async def get_mst():
    paths = await utils.minimum_spanning_tree(GRAPH, PATHS)
    return paths