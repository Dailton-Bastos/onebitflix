export const resources = {
	User: {
		properties: {
			firstName: 'Primeiro Nome',
			lastName: 'Sobrenome',
			phone: 'Telefone',
			birth: 'Data de Nascimento',
			email: 'E-mail',
			password: 'Senha',
			role: 'Perfil',
			createdAt: 'Criado em',
			updatedAt: 'Atualizado em'
		}
	},
	Category: {
		properties: {
			name: 'Nome',
			position: 'Posição',
			createdAt: 'Criado em',
			updatedAt: 'Atualizado em'
		}
	},
	Course: {
		properties: {
			name: 'Nome',
			synopsis: 'Sinopse',
			featured: 'Em Destaque',
			categoryId: 'Categoria',
			thumbnailUrl: 'URL da Capa',
			uploadThumbnail: 'Upload da Capa',
			createdAt: 'Criado em',
			updatedAt: 'Atualizado em'
		}
	},
	Episode: {
		properties: {
			name: 'Nome',
			synopsis: 'Sinopse',
			order: 'Ordem',
			videoUrl: 'URL do Vídeo',
			secondsLong: 'Segundos de Duração',
			courseId: 'Curso',
			uploadVideo: 'Vídeo Upload',
			createdAt: 'Criado em',
			updatedAt: 'Atualizado em'
		}
	}
}
