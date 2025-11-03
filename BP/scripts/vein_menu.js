import { world, system, ItemStack } from '@minecraft/server'
import { ActionFormData, ModalFormData } from '@minecraft/server-ui'
import { veinHandler } from 'vein_mine.js'
import { list, blacklist, maxLimit, setMaxLimit } from 'global_variables.js'

function playerMessage(player, text) {
    system.run(() => {
        player.onScreenDisplay.setActionBar({ translate: text })
    })
}

export function configMenu(player) {

    const menu = new ActionFormData()
        .title('Excavate Configuration')
        .button('Add Block', "textures/ui/realms_slot_check")
        .button('Remove Block', "textures/ui/realms_red_x")
        .button('Shape Mode', "textures/ui/world_glyph")
        .button('Block Limit', "textures/ui/icon_setting")
    if (player.getDynamicProperty('dorios:veinEnabled')) {
        menu.button('Disable Excavate', "textures/ui/toggle_on");
    } else {
        menu.button('Enable Excavate', "textures/ui/toggle_off");
    }

    const baseButtons = 5

    if (player.playerPermissionLevel == 2) {
        menu.button('Set Global Block Limit', "textures/ui/Wrenches1")
        menu.button('Add to blacklist', "textures/blocks/barrier")
        menu.button('Remove from blacklist', "textures/ui/icon_trash")
        menu.button('Add to Default List', "textures/ui/realms_slot_check")
        menu.button('Remove from Default List', "textures/ui/realms_red_x")
    }

    menu.show(player).then(({ canceled, selection }) => {
        if (canceled) return;

        switch (selection) {
            case 0:
                playerMessage(player, '§eBreak a block to add it ')

                if (!player.getDynamicProperty("dorios:isAdding")) {
                    player.setDynamicProperty('dorios:isAdding', true)
                } else {
                    player.setDynamicProperty('dorios:isAdding', false)
                }

                break;
            case 1:
                let veinList;
                try {
                    const raw = player.getDynamicProperty("dorios:veinList");
                    veinList = raw ? JSON.parse(raw) : list;
                } catch (e) {
                    console.warn("[ERROR] Failed to read vein list, resetting...");
                    veinList = list;
                }

                let removeMenu = new ActionFormData()
                    .title('Select a block to remove')

                veinList.forEach(block => {
                    removeMenu.button({ translate: (new ItemStack(block).localizationKey) })
                })

                removeMenu.show(player).then(({ canceled, selection }) => {
                    if (canceled) return;

                    const selectedBlock = veinList[selection]

                    if (selectedBlock) {
                        veinList.splice(selection, 1)
                        player.setDynamicProperty("dorios:veinList", JSON.stringify(veinList))
                        playerMessage(player, '§aBlock successfully removed')
                    }

                })

                break;
            case 2:
                let shapes = new ActionFormData()
                    .title('Vein Shapes')

                Object.keys(veinHandler).forEach(name => {
                    shapes.button(`${name}`)
                })

                shapes.show(player).then(({ canceled, selection }) => {
                    if (canceled) return;

                    let shape = Object.keys(veinHandler)[selection]

                    player.setDynamicProperty('dorios:veinShape', shape)
                    playerMessage(player, "§aData successfully updated")
                })

                break;
            case 3:
                let limitMenu = new ModalFormData()
                    .title('Vein Limit')
                    .label('')
                    .slider('Limit', 1, maxLimit)
                    .show(player).then(({ canceled, formValues }) => {
                        if (canceled) return;

                        let quantity = formValues[1]

                        player.setDynamicProperty('dorios:veinLimit', quantity)
                        playerMessage(player, "§aData successfully updated")
                    })

                break;
            case 4:
                let isEnabled = player.getDynamicProperty('dorios:veinEnabled')

                player.setDynamicProperty('dorios:veinEnabled', !isEnabled)

                if (isEnabled) {
                    playerMessage(player, "§eExcavate §cDisabled")
                } else {
                    playerMessage(player, "§eExcavate §aEnabled")
                }

                break;
            // ===== Admin Options =====
            case baseButtons + 0:
                let maxLimitMenu = new ModalFormData()
                    .title('Vein Limit')
                    .label('')
                    .textField('Max Limit', '')
                    .show(player).then(({ canceled, formValues }) => {
                        if (canceled) return;

                        let quantity = formValues[1]

                        if (isNaN(quantity)) {
                            playerMessage(player, 'Number not valid')
                            return;
                        }

                        quantity = Number(quantity)

                        setMaxLimit(quantity)
                        player.setDynamicProperty('dorios:veinLimit', quantity)
                        playerMessage(player, "§aData successfully updated")
                    })

                break;
            case baseButtons + 1:
                playerMessage(player, '§eBreak a block to add it ')

                if (!player.getDynamicProperty("dorios:isBlacklistAdding")) {
                    player.setDynamicProperty('dorios:isBlacklistAdding', true)
                } else {
                    player.setDynamicProperty('dorios:isBlacklistAdding', false)
                }

                break;
            case baseButtons + 2:
                let blackListMenu = new ActionFormData()
                    .title('Select a block to remove')

                blacklist.forEach(block => {
                    blackListMenu.button({ translate: (new ItemStack(block).localizationKey) })
                })

                blackListMenu.show(player).then(({ canceled, selection }) => {
                    if (canceled) return;

                    let selectedBlock = blacklist[selection]

                    if (selectedBlock) {
                        blacklist.splice(selection, 1)
                        world.setDynamicProperty('dorios:veinBlacklist', JSON.stringify(blacklist))
                        playerMessage(player, '§aBlock successfully removed')
                    }

                })

                break;
            case baseButtons + 3:
                playerMessage(player, '§eBreak a block to add it ')

                if (!player.getDynamicProperty("dorios:isDefaultAdding")) {
                    player.setDynamicProperty('dorios:isDefaultAdding', true)
                } else {
                    player.setDynamicProperty('dorios:isDefaultAdding', false)
                }

                break;
            case baseButtons + 4:
                let defaultMenu = new ActionFormData()
                    .title('Select a block to remove')

                list.forEach(block => {
                    defaultMenu.button({ translate: (new ItemStack(block).localizationKey) })
                })

                defaultMenu.show(player).then(({ canceled, selection }) => {
                    if (canceled) return;

                    let selectedBlock = list[selection]

                    if (selectedBlock) {
                        list.splice(selection, 1)
                        world.setDynamicProperty('dorios:initialVein', JSON.stringify(list))
                        playerMessage(player, '§aBlock successfully removed')
                    }

                })

                break;
            default:
                console.warn("Unknown option selected.");
                break;
        }

    })
}

world.beforeEvents.playerBreakBlock.subscribe(e => {
    const { player, block } = e

    if (player.getDynamicProperty("dorios:isAdding")) {
        if (blacklist.includes(block.typeId)) {
            playerMessage(player, '§cBlock is on the black list')
            e.cancel = true;
            player.setDynamicProperty('dorios:isAdding', false)
            return;
        }

        let veinList;
        try {
            const raw = player.getDynamicProperty("dorios:veinList");
            veinList = raw ? JSON.parse(raw) : list;
        } catch (e) {
            console.warn("[ERROR] Failed to read vein list, resetting...");
            veinList = list;
        }

        if (veinList.includes(block.typeId)) {
            playerMessage(player, '§cBlock already added')
        } else {
            veinList.push(block.typeId);
            player.setDynamicProperty("dorios:veinList", JSON.stringify(veinList));
            playerMessage(player, '§aBlock successfully added')
        }

        e.cancel = true
        player.setDynamicProperty('dorios:isAdding', false)
        return;
    }

    if (player.getDynamicProperty("dorios:isBlacklistAdding")) {
        if (blacklist.includes(block.typeId)) {
            playerMessage(player, '§cBlock already added')
        } else {
            blacklist.push(block.typeId);
            world.setDynamicProperty("dorios:veinBlacklist", JSON.stringify(blacklist));
            playerMessage(player, '§aBlock successfully added')
        }

        e.cancel = true
        player.setDynamicProperty('dorios:isBlacklistAdding', false)
        return;
    }

    if (player.getDynamicProperty("dorios:isDefaultAdding")) {
        if (blacklist.includes(block.typeId)) {
            playerMessage(player, '§cBlock is on the black list')
            e.cancel = true;
            player.setDynamicProperty('dorios:isDefaultAdding', false)
            return;
        }
        if (list.includes(block.typeId)) {
            playerMessage(player, '§cBlock already added')
        } else {
            list.push(block.typeId);
            world.setDynamicProperty("dorios:initialVein", JSON.stringify(list));
            playerMessage(player, '§aBlock successfully added')
        }

        e.cancel = true
        player.setDynamicProperty('dorios:isDefaultAdding', false)
        return;
    }
})