def find_by_truncated_id(relation, id):
    for item in relation:
        if str(item.get('_id'))[:8] == id:
            return item

    return None
