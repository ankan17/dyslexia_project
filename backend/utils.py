def find_by_truncated_id(relation, id, key='_id'):
    for item in relation.find():
        if str(item[key])[:8] == id:
            return item

    return None


def delete_item(relation, id=None):
    if not id:
        relation.delete_many({})
