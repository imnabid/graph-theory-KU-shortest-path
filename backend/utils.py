import networkx as nx
import json
from pprint import pprint as printf

async def create_graph(fpath:str):
    with open(fpath) as f:
        data = f.read()
    nodes = json.loads(data)
    G = nx.Graph()
    for node in nodes:
        edges_and_costs = [] #list of (node, node, weight)
        for neighbour in node['neighbours']:
            edges_and_costs.append((node['id'], neighbour['id'], neighbour['cost']))
        G.add_weighted_edges_from(edges_and_costs)
    return G


async def load_paths(fpath:str):
    with open(fpath) as f:
        data = f.read()
    return json.loads(data)

def is_the_path_between(path, start_id, end_id):
    return path[0].__getitem__('id') == start_id and path[-1].__getitem__('id') == end_id or path[0].__getitem__('id') == end_id and path[-1].__getitem__('id') == start_id

async def shortest_path(G, paths, start_node, end_node):
    path_nodes = nx.dijkstra_path(G, source=start_node, target=end_node)
    # path_nodes = nx.shortest_path(G, source=start_node, target=end_node)
    print(path_nodes)
    path_collection = []
    for i in range(len(path_nodes)-1):
        start_id = path_nodes[i]
        end_id = path_nodes[i+1]
        
        for path in paths:
            if is_the_path_between(path, start_id, end_id):
                path_collection.append(path)
                break
    return path_collection

async def minimum_spanning_tree(G, paths):
    mst = nx.minimum_spanning_tree(G)
    mst_edges = list(mst.edges())
    path_collection = []
    for start_id, end_id in mst_edges:
        for path in paths:
            if is_the_path_between(path, start_id, end_id):
                path_collection.append(path)
                break
    return path_collection