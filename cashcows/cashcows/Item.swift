//
//  Item.swift
//  cashcows
//
//  Created by Qiu YuTong on 27/6/24.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
