import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {
  @Output() toggle = new EventEmitter<void>();

  onToggle() {
    this.toggle.emit();
  }
}