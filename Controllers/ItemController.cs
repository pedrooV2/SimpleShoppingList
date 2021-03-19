using SimpleShoppingList.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SimpleShoppingList.Controllers
{
    public class ItemController : ApiController
    {
        // POST: api/Item
        public IHttpActionResult Post([FromBody]Item item)
        {
            ShoppingList shoppingList = ShoppingListController.shoppingLists
                .Where(s => s.Id == item.ShoppingListId)
                .FirstOrDefault();

            if(shoppingList == null)
            {
                return NotFound();
            }

            item.Id = (shoppingList.Items.Count != 0) ? shoppingList.Items.Max(i => i.Id) + 1 : 0;

            shoppingList.Items.Add(item);
            return Ok(shoppingList);
        }

        // PUT: api/Item/5
        public IHttpActionResult Put(int id, [FromBody]Item Item)
        {
            ShoppingList shoppingList = ShoppingListController.shoppingLists
                .Where(s => s.Id == Item.ShoppingListId)
                .FirstOrDefault();

            if(shoppingList == null)
            {
                return NotFound();
            }

            Item itemChanged = shoppingList.Items.Where(i => i.Id == id).FirstOrDefault();

            if(itemChanged == null)
            {
                return NotFound();
            }

            itemChanged.Checked = Item.Checked;

            return Ok(shoppingList);
        }

        // DELETE: api/Item/5
        public IHttpActionResult Delete(int id)
        {
            ShoppingList shoppingList = ShoppingListController.shoppingLists[0];

            Item item = shoppingList.Items.Where(i => i.Id == id).FirstOrDefault();

            if(item == null)
            {
                return NotFound();
            }

            shoppingList.Items.Remove(item);

            return Ok(shoppingList);
        }
    }
}
