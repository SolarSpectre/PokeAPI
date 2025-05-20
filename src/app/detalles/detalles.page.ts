import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService, PokemonComment } from '../services/firebase.service';

@Component({
  selector: 'app-detalles',
  standalone: true,
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  imports: [IonicModule, NgFor, NgIf, FormsModule, DatePipe]
})
export class DetallesPage implements OnInit {
  pokemon: any;
  error: string | null = null;
  comments: PokemonComment[] = [];
  newComment: string = '';
  loadingComments = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private firebaseService: FirebaseService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.loadPokemonDetails(name);
      this.loadComments(name);
    }
  }

  async loadComments(pokemonName: string) {
    try {
      this.loadingComments = true;
      this.comments = await this.firebaseService.getPokemonComments(pokemonName);
      this.loadingComments = false;
    } catch (error) {
      console.error('Error loading comments:', error);
      this.presentToast('Error loading comments');
      this.loadingComments = false;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  loadPokemonDetails(name: string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.pokemon = {
          id: data.id,
          name: data.name,
          height: data.height,
          weight: data.weight,
          image: data.sprites.front_default,
          types: data.types.map((t: any) => t.type.name),
          abilities: data.abilities.map((a: any) => a.ability.name),
          stats: data.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
        };
        this.error = null;
      },
      error: (err) => {
        this.pokemon = null;
        this.error = 'No se encontró el Pokémon.';
        console.error(err);
      },
    });
  }

  async addComment() {
    if (!this.newComment.trim()) {
      this.presentToast('Please enter a comment');
      return;
    }

    try {
      const comment: PokemonComment = {
        pokemonName: this.pokemon.name,
        comment: this.newComment.trim(),
        timestamp: new Date()
      };

      await this.firebaseService.addComment(comment);
      this.newComment = '';
      await this.loadComments(this.pokemon.name);
      this.presentToast('Comentario agregado exitosamente');
    } catch (error) {
      console.error('Error adding comment:', error);
      this.presentToast('Error adding comment');
    }
  }

  async deleteComment(commentId: string) {
    try {
      await this.firebaseService.deleteComment(commentId);
      await this.loadComments(this.pokemon.name);
      this.presentToast('Comentario eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting comment:', error);
      this.presentToast('Error deleting comment');
    }
  }
}
